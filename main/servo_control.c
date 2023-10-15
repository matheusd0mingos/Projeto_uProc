// ServoControl.c

#include "servo_control.h"
#include "esp_log.h"
#include "driver/mcpwm.h"
#include "soc/mcpwm_periph.h"

#define SERVO_MIN_PULSEWIDTH 500   //Minimum pulse width in microsecond
#define SERVO_MAX_PULSEWIDTH 2400  //Maximum pulse width in microsecond
#define SERVO_MAX_DEGREE 180       //Maximum angle in degree

static uint8_t servo_pin;

void servo_init(uint8_t pin) {
    servo_pin = pin;

    mcpwm_gpio_init(MCPWM_UNIT_0, MCPWM0A, servo_pin);
    mcpwm_config_t pwm_config;
    pwm_config.frequency = 50;    //frequency = 50Hz, i.e. for every servo motor time period should be 20ms
    pwm_config.cmpr_a = 0;        //duty cycle of PWMxA = 0
    pwm_config.cmpr_b = 0;        //duty cycle of PWMxb = 0
    pwm_config.counter_mode = MCPWM_UP_COUNTER;
    pwm_config.duty_mode = MCPWM_DUTY_MODE_0;
    mcpwm_init(MCPWM_UNIT_0, MCPWM_TIMER_0, &pwm_config);
}

void rotate_to(uint8_t angle) {
    if (angle > SERVO_MAX_DEGREE) {
        angle = SERVO_MAX_DEGREE;
    }
    
    uint32_t pulse_width = (angle * (SERVO_MAX_PULSEWIDTH - SERVO_MIN_PULSEWIDTH) / SERVO_MAX_DEGREE) + SERVO_MIN_PULSEWIDTH;
    mcpwm_set_duty_in_us(MCPWM_UNIT_0, MCPWM_TIMER_0, MCPWM_OPR_A, pulse_width);
}
