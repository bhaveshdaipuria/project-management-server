import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      userId,
    });
    return createdProject.save();
  }

  async findAll(userId: string, page: number = 1, limit: number = 10, search?: string) {
    const query: any = { userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await this.projectModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.projectModel.countDocuments(query);

    return {
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id, userId }).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.projectModel.findOneAndUpdate(
      { _id: id, userId },
      updateProjectDto,
      { new: true },
    ).exec();
    
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.projectModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
