import { Observable } from 'rxjs';

export abstract class CmsComponentData {
  uid: string;
  type?: string;
  contextParameters: any;
  data$: Observable<any>;
}
