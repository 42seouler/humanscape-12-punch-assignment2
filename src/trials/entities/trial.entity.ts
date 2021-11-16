import { Optional } from '@nestjs/common'
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Trial {

    @PrimaryColumn()
    id: string // 과제번호

    @Column()
    title: string // 과제명
    
    @Column({ nullable: true })
    department: string // 진료과
    
    @Column({ nullable: true })
    institution: string // 연구책임기관
    
    @Column({ nullable: true })
    subjectCount: number // 전체목표연구대상자수
    
    @Column({ nullable: true })
    period: string // 연구기간
    
    @Column({ nullable: true })
    researchType: string // 연구종류
    
    @Column({ nullable: true })
    stage: string // 임상시험단계(연구모형)
    
    @Column({ nullable: true })
    scope: string // 연구범위
    
    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date
}
