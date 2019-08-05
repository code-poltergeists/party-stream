export default class Message {
  constructor(
    public id: string,
    public text: string,
    public userId: string,
    public date: Date
  ) {}

  static fromMap(map: any) {
    const { id, text, userId, date } = map;
    return new this(id, text, userId, date);
  }
}
