import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
import { AddressValidation } from '@spartacus/core';

describe('Address Verification Selectors', () => {
  let store: Store<fromReducers.CheckoutState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('checkout', fromReducers.getReducers())
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getAddressVerificationResults', () => {
    it('should return all address verification results', () => {
      const addressValidation: AddressValidation = {
        decision: 'test address validation',
        suggestedAddresses: [{ id: 'address1' }]
      };

      let result;
      store
        .pipe(select(fromSelectors.getAddressVerificationResults))
        .subscribe(value => (result = value));

      expect(result).toEqual({});

      store.dispatch(new fromActions.VerifyAddressSuccess(addressValidation));

      expect(result).toEqual(addressValidation);
    });
  });
});
