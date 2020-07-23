import { INext, IReq, IRes } from '../../http';

export type middlewareFn = (req: IReq, res: IRes, next: INext) => Promise<any>;
