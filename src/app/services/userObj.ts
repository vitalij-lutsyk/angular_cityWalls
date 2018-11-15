export class UserObj {
  constructor(
    public geometry: {
      coordinates: Array<number>;
      type: string;
    },
    public properties: {
      name: string;
      author: string;
      locationType: string;
      type: string;
      userImage: string;
      country?: string;
      city?: string;
      street?: string;
      house?: string;
      id?: string;
    },
    public type: string,
    public id: string
  ) {}
}
