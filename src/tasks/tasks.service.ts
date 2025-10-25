import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    return createdTask.save();
  }

  async findAll(userId: string, projectId?: string, status?: string, page: number = 1, limit: number = 10) {
    const query: any = { userId };
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    if (status) {
      query.status = status;
    }

    const tasks = await this.taskModel
      .find(query)
      .populate('projectId', 'title')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.taskModel.countDocuments(query);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).populate('projectId', 'title').exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, userId },
      updateTaskDto,
      { new: true },
    ).populate('projectId', 'title').exec();
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
