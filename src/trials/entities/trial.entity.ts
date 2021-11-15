import { Column, PrimaryGeneratedColumn } from 'typeorm'

export class Trial {

    @PrimaryGeneratedColumn()
    "과제번호"
    
    @Column()
    "과제명"
    
    @Column()
    "연구기관"
    
    @Column()
    "연구범위"
    
    @Column()
    "연구종류"
    
    @Column()
    "연구책임기관"
    
    @Column()
    "임상시험단계(연구모형)"
    
    @Column()
    "전체목표연구대상자수"
    
    @Column()
    "진료과"

}
