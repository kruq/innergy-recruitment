import { ServiceType } from '../types';

export type ServiceRelation = { parent: ServiceType; child: ServiceType };

const Relations: ServiceRelation[] = [
  { parent: 'VideoRecording', child: 'BlurayPackage' },
  { parent: 'VideoRecording', child: 'TwoDayEvent' },
  { parent: 'Photography', child: 'TwoDayEvent' },
];

export default Relations;
