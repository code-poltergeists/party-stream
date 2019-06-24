import { db, auth } from '../db';
import User from '@/models/User';
import { BehaviorSubject } from 'rxjs';

export default class AuthService {
  static instance: AuthService;

  private static isAuthenticated$ = new BehaviorSubject<boolean>(false);

  private static subscription: firebase.Unsubscribe;

  constructor() {
    if (!AuthService.subscription) {
      AuthService.subscription = auth.onAuthStateChanged(user => {
        AuthService.isAuthenticated$.next(user === null);
      });
    }
    if (AuthService.instance) {
      return AuthService.instance;
    } else {
      AuthService.instance = this;
      return this;
    }
  }

  static async signUp(email: string, password: string, username: string, name: string, photoUrl: string): Promise<User> {
    return auth.createUserWithEmailAndPassword(email, password).then(_ => {
      let user = new User();
      user.name = name;
      user.photoUrl = photoUrl;
      user.username = username;
      return user;
    });
  }

  static async signIn(email: string, password: string): Promise<any> {
    return auth.signInWithEmailAndPassword(email, password);
  }

  static async currentUser(): Promise<User | null> {
    if (!auth.currentUser) {
      return null;
    }
    return db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
      const data = doc.data()!;
      let user = new User();
      user.name = data.name;
      user.photoUrl = data.photoUrl;
      user.username = data.username;
      return user;
    });
  }

  static get isAuthenticated(): boolean {
    return AuthService.isAuthenticated$.value;
  }
}