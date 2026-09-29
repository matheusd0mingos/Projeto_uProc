# uProc

Sistema embarcado baseado em **ESP32**, **FreeRTOS**, **MQTT** e **AWS IoT Core**, desenvolvido para demonstrar comunicação entre dispositivos IoT e serviços em nuvem.

O projeto utiliza o ESP32 como dispositivo conectado à internet, permitindo receber comandos remotamente por MQTT e executar ações físicas através de servomotores.

## Visão geral

O uProc estabelece uma comunicação entre três componentes principais:

```text
┌──────────────┐
│  Aplicação   │
│ / Serviço    │
└──────┬───────┘
       │
       │ MQTT
       ▼
┌─────────────────┐
│   AWS IoT Core  │
└────────┬────────┘
         │
         │ MQTT / TLS
         ▼
┌─────────────────┐
│      ESP32      │
│                 │
│    FreeRTOS     │
│        │        │
│        ▼        │
│    Servomotor   │
└─────────────────┘
```

O ESP32 conecta-se à rede Wi-Fi e estabelece uma conexão segura com o **AWS IoT Core** utilizando MQTT sobre TLS. A partir daí, o dispositivo pode receber mensagens publicadas em tópicos MQTT e executar ações correspondentes.

## Funcionalidades

* Conexão do ESP32 a uma rede Wi-Fi.
* Comunicação MQTT com o AWS IoT Core.
* Comunicação segura utilizando certificados TLS.
* Inscrição em tópicos MQTT (`subscribe`).
* Publicação de mensagens MQTT (`publish`).
* Reconexão automática em caso de perda de conexão.
* Processamento de mensagens recebidas pelo ESP32.
* Controle de servomotores a partir de comandos recebidos.
* Integração entre código embarcado em C e serviço baseado em Node.js.

## Tecnologias

| Tecnologia       | Utilização                        |
| ---------------- | --------------------------------- |
| **ESP32**        | Hardware embarcado                |
| **C**            | Firmware                          |
| **FreeRTOS**     | Gerenciamento de tarefas no ESP32 |
| **ESP-IDF**      | Framework de desenvolvimento      |
| **AWS IoT Core** | Comunicação e gerenciamento IoT   |
| **MQTT**         | Protocolo de comunicação          |
| **TLS**          | Comunicação segura                |
| **Node.js**      | Cliente/serviço de integração     |
| **JavaScript**   | Lógica do serviço MQTT            |

## Arquitetura

O fluxo principal de comunicação é:

```text
              Internet
                  │
                  │ MQTT/TLS
                  ▼
          ┌───────────────┐
          │ AWS IoT Core  │
          └───────┬───────┘
                  │
           ┌──────┴──────┐
           │             │
           ▼             ▼
       ESP32          Node.js
           │
           ▼
      FreeRTOS Task
           │
           ▼
    MQTT Subscription
           │
           ▼
    Command Processing
           │
           ▼
      Servo Control
```

### Fluxo de comandos

Quando uma mensagem é publicada no tópico MQTT ao qual o ESP32 está inscrito:

```text
Mensagem MQTT
      │
      ▼
iot_subscribe_callback_handler()
      │
      ├── "quente"
      ├── "morna"
      └── "fria"
              │
              ▼
        Controle do servo
```

Cada comando recebido pode provocar o posicionamento do servomotor em uma posição previamente definida.

## Segurança

A comunicação com o AWS IoT Core utiliza **TLS e certificados digitais** para autenticação do dispositivo.

O firmware suporta diferentes formas de carregamento dos certificados, dependendo da configuração e versão utilizada do ESP-IDF.

> **Importante:** certificados, chaves privadas, credenciais Wi-Fi e outros segredos não devem ser versionados no repositório.

Para executar o projeto, configure essas informações de acordo com o ambiente utilizado.

## Estrutura do projeto

Os principais componentes são:

### `subscribe_publish_sample.c`

Firmware principal do ESP32.

Responsabilidades:

* Inicialização do Wi-Fi.
* Gerenciamento de eventos de conexão.
* Inicialização do cliente AWS IoT.
* Conexão ao AWS IoT Core.
* Subscribe em tópicos MQTT.
* Publicação de mensagens.
* Tratamento de mensagens recebidas.
* Reconexão do cliente MQTT.
* Integração com o controle dos servomotores.

Principais funções:

#### `initialise_wifi()`

Inicializa a conexão Wi-Fi e registra os handlers responsáveis pelo gerenciamento dos eventos de rede.

#### `event_handler()`

Processa eventos relacionados à conexão Wi-Fi, como:

* conexão;
* obtenção de endereço IP;
* desconexão.

#### `aws_iot_task()`

Principal tarefa relacionada à comunicação com o AWS IoT Core.

É responsável por:

1. Inicializar o cliente MQTT.
2. Estabelecer a conexão.
3. Realizar subscriptions.
4. Publicar mensagens.
5. Processar a comunicação continuamente.
6. Tratar reconexões.

#### `iot_subscribe_callback_handler()`

Callback executado quando uma mensagem é recebida em um tópico MQTT.

A mensagem recebida determina a ação realizada pelo servomotor.

#### `disconnectCallbackHandler()`

Responsável pelo tratamento de desconexões do cliente MQTT.

---

### `servo_control.h`

Interface do módulo responsável pelo controle dos servomotores.

Define as funções e estruturas necessárias para utilização do módulo.

### `servo_control.c`

Implementação do controle dos servomotores.

Responsável por:

* inicialização;
* configuração;
* movimentação;
* posicionamento dos servomotores.

---

### `index.mjs`

Implementa o componente Node.js responsável pela comunicação MQTT.

Responsabilidades:

* carregamento dos certificados;
* configuração do cliente MQTT;
* conexão ao broker;
* publicação de mensagens;
* tratamento de eventos MQTT;
* reconexão;
* integração com o handler da aplicação.

Principais eventos tratados:

```text
connect
message
error
close
reconnect
```

#### `handler`

Manipulador responsável por processar eventos recebidos pela aplicação.

Quando a intenção `PostMessageIntent` é identificada, uma mensagem pode ser publicada no tópico MQTT correspondente.

#### `waitForConnection()`

Aguarda o estabelecimento da conexão MQTT antes de realizar operações que dependem do cliente conectado.

#### `generateResponse()`

Gera a resposta utilizada pelo handler após o processamento da solicitação.

## Comunicação MQTT

O MQTT é utilizado como mecanismo de comunicação entre os componentes.

Conceitualmente:

```text
Publisher
    │
    │ publish()
    ▼
┌───────────────┐
│ AWS IoT Core  │
└───────┬───────┘
        │
        │ subscribe()
        ▼
     ESP32
```

Isso permite desacoplar o dispositivo embarcado do componente responsável por gerar os comandos.

## Execução

### ESP32

O firmware deve ser compilado utilizando o **ESP-IDF** e configurado com:

* credenciais Wi-Fi;
* endpoint do AWS IoT Core;
* certificado do dispositivo;
* chave privada;
* certificado da autoridade certificadora;
* tópicos MQTT utilizados pela aplicação.

### Node.js

Instale as dependências:

```bash
npm install
```

Configure os certificados e parâmetros necessários para conexão ao AWS IoT Core.

Execute:

```bash
node index.mjs
```

> Os comandos exatos podem variar de acordo com a configuração utilizada no ambiente de desenvolvimento.

## Conceitos demonstrados

O projeto foi desenvolvido como um estudo prático de:

* Internet das Coisas (IoT);
* sistemas embarcados;
* programação concorrente com FreeRTOS;
* comunicação assíncrona;
* protocolo MQTT;
* comunicação segura utilizando TLS;
* AWS IoT Core;
* integração entre sistemas embarcados e aplicações Node.js;
* controle de atuadores físicos a partir de comandos remotos.

## Referência

Parte da implementação foi baseada e adaptada a partir do projeto:

https://github.com/xinwenfu/platformio-espidf-aws-iot

## Status

Projeto desenvolvido para fins de estudo e experimentação com **ESP32, AWS IoT e comunicação MQTT**.
