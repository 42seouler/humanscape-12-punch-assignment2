import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Trial {

    @PrimaryColumn()
    id: string // 과제번호

    @Column()
    title: string // 과제명
    
    @Column()
    department: string // 진료과
    
    @Column()
    institution: string // 연구책임기관
    
    @Column()
    subjectCount: number // 전체목표연구대상자수
    
    @Column()
    period: string // 연구기간
    
    @Column()
    researchType: string // 연구종류
    
    @Column()
    stage: string // 임상시험단계(연구모형)
    
    @Column()
    scope: string // 연구범위
    
    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date
}
