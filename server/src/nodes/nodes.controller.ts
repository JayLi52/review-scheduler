import { Body, Controller, Get, Post } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { HeartbeatDto, RegisterNodeDto } from './nodes.service';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post('register')
  register(@Body() body: RegisterNodeDto) {
    return this.nodesService.register(body);
  }

  @Post('heartbeat')
  heartbeat(@Body() body: HeartbeatDto) {
    const updated = this.nodesService.heartbeat(body);
    if (!updated) {
      return { error: 'NODE_NOT_FOUND' };
    }
    return updated;
  }

  @Get()
  list() {
    return this.nodesService.list();
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { HeartbeatDto, RegisterNodeDto } from './nodes.service';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post('register')
  register(@Body() body: RegisterNodeDto) {
    return this.nodesService.register(body);
  }

  @Post('heartbeat')
  heartbeat(@Body() body: HeartbeatDto) {
    const updated = this.nodesService.heartbeat(body);
    if (!updated) {
      return { error: 'NODE_NOT_FOUND' };
    }
    return updated;
  }

  @Get()
  list() {
    return this.nodesService.list();
  }
}


