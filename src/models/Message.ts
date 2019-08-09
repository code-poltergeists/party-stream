export default class Message {
  constructor(
    public id: string,
    public text: string | null | undefined,
    public attachment: string | null | undefined,
    public userId: string,
    public date: Date
  ) {}

  static fromMap(map: any) {
    const { id, text, attachment, userId, date } = map;
    return new this(id, text, attachment, userId, date);
  }
}
