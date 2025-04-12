import { BASE_URL, token } from '../../config/const';
import AddressService from '../../services/AddressService';

// Mockear el módulo de configuración
jest.mock('../../config/const', () => ({
  BASE_URL: 'http://api.example.com',
  token: 'test-token'
}));

describe('AddressService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('saveAddress', () => {
    it('should make a POST request to save address', async () => {
      const mockAddress = { street: '123 Test St', city: 'Testville' };
      const mockResponse = { success: true, id: '123' };

      fetch.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await AddressService.saveAddress(mockAddress);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/address/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mockAddress),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockAddress = { street: '123 Test St', city: 'Testville' };
      const mockError = new Error('Network error');

      fetch.mockRejectOnce(mockError);

      await expect(AddressService.saveAddress(mockAddress))
        .rejects
        .toThrow('Network error');
    });
  });

  describe('getAddressByClientId', () => {
    it('should make a GET request to fetch address by client ID', async () => {
      const clientId = 'client-123';
      const mockResponse = [{ id: '1', street: '123 Test St' }];

      fetch.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await AddressService.getAddressByClientId(clientId);

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/address/find-by-client/${clientId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const clientId = 'client-123';
      const mockError = new Error('Network error');

      fetch.mockRejectOnce(mockError);

      await expect(AddressService.getAddressByClientId(clientId))
        .rejects
        .toThrow('Network error');
    });
  });
});