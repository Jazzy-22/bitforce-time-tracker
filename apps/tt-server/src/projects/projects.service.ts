import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { MembersService } from 'src/members/members.service';
import { StatusService } from 'src/status/status.service';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private rolesService: RolesService,
    private membersService: MembersService,
    private statusService: StatusService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const project = await this.projectsRepository.save(createProjectDto);
      if (project) {
        const role = await this.rolesService.findHighest();
        const m = new CreateMemberDto();
        m.project_id = project.id;
        m.user_id = createProjectDto.owner_id;
        m.role_id = role;
        try {
          const member = await this.membersService.create(m);
          if (member.status === 'success') {
            return { status: 'success', data: project };
          } else {
            await this.projectsRepository.delete(project.id);
            return { status: 'error', message: member.message };
          }
        } catch (error) {
          await this.projectsRepository.delete(project.id);
          return { status: 'error', message: error.message };
        }
      }
      return { status: 'error', message: 'Project could not be created' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll(user: any) {
    try {
      let projects;
      if (user.permissions.includes('object_project_view_all')) {
        projects = await this.projectsRepository.find({
          relations: [
            'account',
            'members',
            'status',
            'members.role',
            'members.role.permissions',
          ],
          select: {
            id: true,
            name: true,
            key: true,
            account: { id: true, name: true },
            members: {
              id: true,
              user_id: true,
              role: { id: true, permissions: { label: true } },
            },
            status: { label: true },
            project_url: true,
          },
        });
      } else {
        const members = (await this.membersService.findByUser(user.id)).data;
        if (members.length === 0) {
          return { status: 'success', data: [] };
        }
        projects = await this.projectsRepository.find({
          where: { id: In(members.map((m) => m.project_id)) },
          relations: [
            'account',
            'members',
            'status',
            'members.role',
            'members.role.permissions',
          ],
          select: {
            id: true,
            name: true,
            key: true,
            account: { id: true, name: true },
            members: {
              id: true,
              user_id: true,
              role: { id: true, permissions: true },
            },
            status: { label: true },
            project_url: true,
          },
        });
      }
      projects?.forEach((p) => {
        p.members?.forEach((m) => {
          if (m.user_id === user.id) {
          } else {
            delete m.role;
            delete m.user_id;
          }
        });
      });
      return { status: 'success', data: projects };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOwners(ids: number[]) {
    return await this.projectsRepository.find({
      where: {
        id: In(ids),
      },
      select: ['id', 'owner_id'],
    });
  }

  async findOne(key: string, user: any) {
    try {
      const project = await this.projectsRepository.findOne({
        where: { key },
        relations: [
          'owner',
          'account',
          'members',
          'members.user',
          'members.role',
          'status',
          'tasks',
          'tasks.status',
          'tasks.members',
          'tasks.members.user',
          'tasks.members.role',
        ],
        select: {
          id: true,
          name: true,
          key: true,
          description: true,
          first_contact: true,
          estimated_project_start: true,
          estimated_project_end: true,
          actual_project_start: true,
          actual_project_end: true,
          owner: { first_name: true, last_name: true },
          account: { name: true },
          members: {
            id: true,
            user_id: true,
            user: {
              first_name: true,
              last_name: true,
              img_url: true,
              email: true,
            },
            role: { label: true },
          },
          status_id: true,
          status: { label: true },
          billable: true,
          primary_contact: { first_name: true, last_name: true },
          project_url: true,
          allow_sprints: true,
          tasks: {
            id: true,
            title: true,
            members: {
              id: true,
              user: {
                first_name: true,
                last_name: true,
              },
              role: { label: true },
            },
            status: { label: true },
          },
        },
      });
      if (!user.permissions.includes('object_project_view_all')) {
        const member = project.members.find((m) => m.user_id === user.id);
        if (!member) {
          return { status: 'error', message: 'Not enough privileges' };
        }
      }
      project.members.forEach((m) => {
        delete m.user_id;
      });
      return { status: 'success', data: project };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectsRepository.update(
        id,
        updateProjectDto,
      );
      return { status: 'success', data: project };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const project = await this.projectsRepository.delete(id);
      return { status: 'success', data: project };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateProjects(accs: Account[], users: User[], highRole: number) {
    const mock = [
      { name: 'New Website', key: 'NW' },
      { name: 'Mobile App', key: 'MA' },
      { name: 'Internal App', key: 'IA' },
      { name: 'Client Project', key: 'CP' },
      { name: 'New Feature', key: 'NF' },
      { name: 'Bug Fix', key: 'BF' },
      { name: 'Enhancement', key: 'EN' },
      { name: 'Research', key: 'RS' },
      { name: 'Training', key: 'TR' },
      { name: 'Documentation', key: 'DC' },
      { name: 'Meeting App', key: 'MTA' },
      { name: 'Webservice Integration', key: 'WI' },
      { name: 'Data Migration', key: 'DM' },
      { name: 'Data Analysis', key: 'DA' },
      { name: 'Data Reporting', key: 'DR' },
      { name: 'Data Visualization', key: 'DV' },
      { name: 'Data Collection', key: 'DC' },
      { name: 'Data Processing', key: 'DP' },
      { name: 'Data Validation', key: 'DV' },
      { name: 'Data Verification', key: 'DV' },
      { name: 'Data Cleansing', key: 'DC' },
      { name: 'Data Transformation', key: 'DT' },
      { name: 'Data Aggregation', key: 'DA' },
      { name: 'Data Summarization', key: 'DS' },
      { name: 'Data Normalization', key: 'DN' },
      { name: 'Data Standardization', key: 'DS' },
      { name: 'Data Enrichment', key: 'DE' },
      { name: 'Data Deduplication', key: 'DD' },
      { name: 'Data Matching', key: 'DM' },
      { name: 'Data Merging', key: 'DM' },
      { name: 'Data Splitting', key: 'DS' },
      { name: 'Data Sampling', key: 'DS' },
      { name: 'Data Stratification', key: 'DS' },
      { name: 'Data Segmentation', key: 'DS' },
      { name: 'Data Clustering', key: 'DC' },
    ];
    const statuses = (await this.statusService.findByEntity('project')).data;
    const projects = [];
    accs.forEach((a) => {
      if (mock.length > 0) {
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          const p = new CreateProjectDto();
          p.account_id = a.id;
          p.owner_id = a.owner_id;
          const d = mock.splice(Math.floor(Math.random() * mock.length), 1)[0];
          p.name = d.name;
          p.key = d.key;
          p.status_id =
            statuses[Math.floor(Math.random() * statuses.length)].id;
          projects.push(p);
        }
      }
    });
    try {
      const res = await this.projectsRepository.save(projects);
      if (res) {
        const members = [];
        res.forEach((r) => {
          const m = new CreateMemberDto();
          m.project_id = r.id;
          m.user_id = r.owner_id;
          m.role_id = highRole;
          members.push(m);
          for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            const u = users[Math.floor(Math.random() * users.length)];
            const m = new CreateMemberDto();
            m.project_id = r.id;
            m.user_id = u.id;
            m.role_id = u.role_id;
            members.push(m);
          }
        });
        const secRes = await this.membersService.create(members);
        if (secRes.status === 'success') {
          return { status: 'success', data: res };
        } else {
          await this.projectsRepository.delete(res.map((r) => r.id));
          return { status: 'error', message: secRes.message };
        }
      } else {
        return { status: 'error', message: 'Could not create projects' };
      }
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
