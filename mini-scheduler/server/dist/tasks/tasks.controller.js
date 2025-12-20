"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const scheduler_service_1 = require("../scheduler/scheduler.service");
let TasksController = class TasksController {
    tasksService;
    schedulerService;
    constructor(tasksService, schedulerService) {
        this.tasksService = tasksService;
        this.schedulerService = schedulerService;
    }
    async create(body) {
        const task = this.tasksService.create({
            command: body.command,
            cpu: body.cpu,
            mem: body.mem,
        });
        const scheduleResults = this.schedulerService.schedulePending();
        return { task, scheduleResults };
    }
    list() {
        return this.tasksService.list();
    }
    poll(nodeId) {
        if (!nodeId)
            return [];
        return this.tasksService.getAssignedTasks(nodeId);
    }
    updateStatus(id, body) {
        return this.tasksService.updateStatus(id, body.status);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('poll'),
    __param(0, (0, common_1.Query)('nodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "poll", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "updateStatus", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService,
        scheduler_service_1.SchedulerService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map