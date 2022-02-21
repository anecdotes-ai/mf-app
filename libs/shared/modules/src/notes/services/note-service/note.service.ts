import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from 'core/modules/data/services/abstract-http/abstract-service';
import { AppConfigService } from 'core/services/config/app.config.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note } from './../../models/domain';
import { ResourceType } from 'core/modules/data/models';

@Injectable()
export class NoteService extends AbstractService {
  constructor(http: HttpClient, configService: AppConfigService) {
    super(http, configService);
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(
      this.buildUrl((a) => a.notes, {
        resource_type: note.resource_type,
        resource_id: note.resource_id,
      }),
      note
    );
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(
      this.buildUrl((a) => a.notes, {
        resource_type: note.resource_type,
        resource_id: note.resource_id,
      }),
      note
    );
  }

  getNote(resource_type: ResourceType, resource_id: string): Observable<Note> {
    return this.http.get(this.buildUrl((t) => t.notes, {
      resource_type: resource_type,
      resource_id: resource_id,
    })).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return of(null);
        }

        return throwError(err);
      })
    );
  }

  deleteNote(note: Note): Observable<any> {
    return this.http.delete(this.buildUrl((t) => t.notes, {
      resource_type: note.resource_type,
      resource_id: note.resource_id,
    }));
  }
}
