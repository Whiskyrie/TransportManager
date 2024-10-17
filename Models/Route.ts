import BaseModel, { IBaseModel } from "./BaseModel";

export interface IRoute extends IBaseModel {

    startLocation: string;
    endLocation: string;
    distance: number;
    estimatedDuration: number;
    status: 'Pendente' | 'Em Progresso' | 'Concluído' | 'Cancelada';

}

class Route extends BaseModel implements IRoute {

    startLocation: string;
    endLocation: string;
    distance: number;
    estimatedDuration: number;
    status: 'Pendente' | 'Em Progresso' | 'Concluído' | 'Cancelada';

    constructor(
        id: string,
        startLocation: string,
        endLocation: string,
        distance: number,
        estimatedDuration: number
    ) {
        super(id, new Date(), new Date(), true);
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.distance = distance;
        this.estimatedDuration = estimatedDuration;
        this.status = 'Pendente';
    }
    start(): void {
        if (this.status === 'Pendente') {
            this.status = 'Em Progresso';
            this.updateTimestamp();
        }
    }

    complete(): void {
        if (this.status === 'Em Progresso') {
            this.status = 'Concluído';
            this.updateTimestamp();
        }
    }

    cancel(): void {
        if (this.status !== 'Concluído') {
            this.status = 'Cancelada';
            this.updateTimestamp();
        }
    }

    toJSON(): object {
        return {
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            distance: this.distance,
            estimatedDuration: this.estimatedDuration,
            status: this.status
        }
    };
}
export default Route;