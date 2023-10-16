# Documentação do Projeto

Bem-vindo à nossa documentação detalhada sobre as funções de cada arquivo em nosso projeto.

## Arquivos e Suas Funções

### `subscribe_publish_sample.c`

#### Descrição do Código: subscribe_publish_sample.c

##### Inclusões

- Inclui várias bibliotecas padrão, como `<stdio.h>`, `<stdlib.h>`, entre outras.
- Bibliotecas do framework FreeRTOS e do ESP32 são incluídas para permitir multitarefa, gerenciamento de WiFi e logs.
- As bibliotecas do AWS IoT SDK são incluídas para permitir a comunicação com o AWS IoT Core.

##### Definições

- Diversas macros e constantes são definidas, como `MAX_LOG_LENGTH`, `EXAMPLE_WIFI_SSID` e `EXAMPLE_WIFI_PASS` para configuração e operação.
- Há verificações condicionais para determinar a versão do ESP IDF e a maneira como os certificados são carregados (embutidos ou do sistema de arquivos).

##### Funções

###### event_handler()

- Esta função gerencia eventos WiFi, como conexão ao WiFi, obtenção de um endereço IP e desconexão do WiFi.

###### iot_subscribe_callback_handler()

- Esta função é chamada quando uma mensagem é recebida no tópico ao qual o ESP32 está inscrito.
- Quando a mensagem "quente", "fria" ou "morna" é recebida, uma ação é tomada para rotacionar um servo para uma posição específica.

###### disconnectCallbackHandler()

- Esta função lida com desconexões do cliente MQTT, tentando reconectar se necessário.

###### aws_iot_task()

- Esta é a tarefa principal que inicializa o cliente AWS IoT, se conecta ao AWS IoT Core, se inscreve em um tópico e publica mensagens.
- A tarefa mantém o cliente MQTT em execução, tratando a reconexão conforme necessário.

###### initialise_wifi()

- Esta função inicializa a conexão WiFi do ESP32 e registra os manipuladores de eventos para gerenciar a conexão e a obtenção de um endereço IP.

##### Observações

- O código se conecta a uma rede WiFi usando as credenciais definidas e, em seguida, se conecta ao AWS IoT Core usando os certificados e a configuração fornecida.
- Uma vez conectado ao AWS IoT Core, ele se inscreve em um tópico e espera por mensagens. Quando uma mensagem é recebida, a ação correspondente é tomada com base na mensagem.

### `servo_control.h`

**Função Principal:** Interface de controle dos servomotores.

- Declarações de funções para movimentar os servomotores.
- Declarações de constantes e variáveis relacionadas ao controle de servomotores.

### `servo_control.c`

**Função Principal:** Implementação do controle dos servomotores.

- Inicialização dos servomotores.
- Funções para mover servomotores para posições específicas.

### `index.mjs`

Este arquivo implementa a conexão MQTT usando credenciais e certificados e também exporta um manipulador de eventos que trata mensagens recebidas.

#### Importações e constantes:

- **MQTT e Sistema de Arquivos (fs)**: São importados os módulos `mqtt` e `fs` para manipulação da conexão MQTT e leitura dos certificados.
  
- **Constantes de Caminho e Host**: Definem o caminho dos certificados e chaves usados na conexão MQTT e o HOST para a conexão.

#### Configurações e Conexão:

- **Opções de Conexão (options)**: Configura as opções de conexão, incluindo client ID, certificados, protocolo, keepAlive e versão do protocolo.

- **Inicialização e Conexão MQTT**: Utiliza o método `mqtt.connect` para estabelecer uma conexão com o broker MQTT.

#### Eventos do Cliente MQTT:

- **'connect'**: Loga uma mensagem quando conectado com sucesso ao broker MQTT.
- **'message'**: Acionado quando uma mensagem é recebida. Loga o tópico e a mensagem.
- **'error'**: Trata e loga erros durante a conexão MQTT.
- **'close'**: Loga uma mensagem quando a conexão com o broker MQTT é fechada.
- **'reconnect'**: Loga uma tentativa de reconexão com o broker MQTT.

#### Função principal: `handler`

- **Handler (manipulador)**: Esta função é acionada para lidar com eventos recebidos, como solicitações HTTP ou mensagens MQTT. O manipulador verifica a intenção do evento, e, no caso do "PostMessageIntent", tenta publicar uma mensagem no tópico MQTT.

#### Funções Auxiliares:

- **waitForConnection**: Esta função verifica periodicamente (a cada segundo) se o cliente MQTT está conectado, e rejeita a promessa se o número máximo de tentativas for atingido.

- **generateResponse**: Gera uma resposta formatada com a versão e uma mensagem de texto para ser enviada como resposta ao invocador do manipulador.


---

Esperamos que esta documentação detalhada ajude você a compreender melhor as funções e responsabilidades de cada arquivo em nosso projeto. Para informações mais detalhadas ou dúvidas específicas, consulte o conteúdo interno de cada arquivo ou entre em contato conosco.


#### Agradecimentos especiais:
Aos desenvolvedores do projeto https://github.com/xinwenfu/platformio-espidf-aws-iot/tree/main
