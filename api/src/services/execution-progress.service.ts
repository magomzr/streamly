import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import type { IProgressEvent } from '../types';

@Injectable()
export class ExecutionProgressService {
  private readonly sessions = new Map<string, Subject<IProgressEvent>>();

  createSession(sessionId: string): Subject<IProgressEvent> {
    const subject = new Subject<IProgressEvent>();
    this.sessions.set(sessionId, subject);
    return subject;
  }

  getSession(sessionId: string): Subject<IProgressEvent> | undefined {
    return this.sessions.get(sessionId);
  }

  closeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.complete();
      this.sessions.delete(sessionId);
    }
  }

  emit(sessionId: string, event: IProgressEvent): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.next(event);
    }
  }
}
