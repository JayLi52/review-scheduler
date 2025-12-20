import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NodesService } from './nodes.service';
import type { HeartbeatDto, RegisterNodeDto } from './nodes.service';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nodesService.remove(id);
  }
}


