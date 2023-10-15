// ServoControl.h

#ifndef SERVO_CONTROL_H
#define SERVO_CONTROL_H

#include "esp_log.h"
#include "driver/mcpwm.h"
#include "soc/mcpwm_periph.h"

void servo_init(uint8_t pin);
void rotate_to(uint8_t angle);

#endif
