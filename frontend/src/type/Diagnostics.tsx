export interface Diagnostics_Metrics {
  name: string;
  oru_sonic_codes: string;
  diagnostic: string;
  diagnostic_groups: string;
  oru_sonic_units: string;
  units: string;
  min_age: string;
  max_age: string;
  gender: string;
  standard_lower: string;
  standard_higher: string;
  everlab_lower: string;
  everlab_higher: string;
  value: number;
}

export interface Condition {
    name: string;
    status: boolean;
    message: string;
}

export interface Patient {
    name: string;
    birth: string;
    age: number;
    sex: string;
    address: string;
    phone: string;
    referring_doctor: string;
    consulting_doctor: string;
    oru_data: string;
    encoding_data: string;
    analysed: boolean;
    metrics: Diagnostics_Metrics[];
    conditions: Condition[];
}

export class Patient_Data implements Patient {
    constructor(
        public name: string = '',
        public birth: string = '',
        public sex: string = '',
        public age: number = 0,
        public address: string = '',
        public phone: string = '',
        public referring_doctor: string = '',
        public consulting_doctor: string = '',
        public oru_data: string = '',
        public encoding_data: string = '',
        public analysed: boolean = false,
        public metrics: Diagnostics_Metrics[] = [],
        public conditions: Condition[] = []
    ) {}
}