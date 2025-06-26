import { Reflector } from '@nestjs/core';

export const Access = Reflector.createDecorator<string[]>();
