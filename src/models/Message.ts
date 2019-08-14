export default class Message {
  constructor(
    public id: string,
    public text: string | null | undefined,
    public username: string,
    public photoUrl: string,
    public attachment: string | null | undefined,
    public userId: string,
    public date: Date
  ) { }

  static fromMap(map: any) {
    const { id, text, username, photoUrl, attachment, userId, date } = map;
    return new this(id, text, username, photoUrl, attachment, userId, date);
  }
}
