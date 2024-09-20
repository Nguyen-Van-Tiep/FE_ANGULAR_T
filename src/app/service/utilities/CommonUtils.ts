export class CommonUtils{
    constructor() {}

    saveCache(key: string, value: any, expireMinutes: number) {
        const expireTime = new Date().getTime() + expireMinutes * 60000;
        const data = {
          value: value,
          expireTime: expireTime
        };
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    getItem(key: string): any {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);
          if (new Date().getTime() < parsedData.expireTime) {
            return parsedData.value;
          } else {
            localStorage.removeItem(key);
          }
        }
        return null;
      }
    
      removeItem(key: string): void {
        localStorage.removeItem(key);
      }
    
      clear(): void {
        localStorage.clear();
      }

      isExists(key: string): boolean {
        return localStorage.getItem(key) !== null;
      }
}