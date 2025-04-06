import { TestBed } from '@angular/core/testing';

import { GraphQLApiService } from './graph-ql-api.service';

describe('GraphQLApiService', () => {
  let service: GraphQLApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphQLApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
