interface GeocodingResult {
    lat: number;
    lon: number;
    displayName?: string;
}

export class GeocodingService {
    private static cache: { [address: string]: GeocodingResult } = {};

    static async getCoordinates(address: string): Promise<GeocodingResult | null> {
        if (!address) return null;

        // Verificar cache primeiro
        if (this.cache[address]) {
            return this.cache[address];
        }

        try {
            const encodedAddress = encodeURIComponent(address);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'RubiRide/1.0'
                    }
                }
            );

            const data = await response.json();

            if (data && data.length > 0) {
                const result = {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    displayName: data[0].display_name
                };

                this.cache[address] = result;
                return result;
            }
            return null;
        } catch (error) {
            console.error('Erro na geocodificação:', error);
            return null;
        }
    }
}
