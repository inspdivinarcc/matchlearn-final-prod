export type DBUser = { id:string; username:string; coins:number; isPremium:boolean; premiumDays:number };
export type DBInventory = { userId:string; nfts:{ id:number; name:string; price:number; rarity:string; owned:boolean }[] };

const globalAny = global as any;
if(!globalAny.__ML_DB__){
  globalAny.__ML_DB__ = {
    users: [] as DBUser[],
    inventories: [] as DBInventory[],
  };
}

export const db = globalAny.__ML_DB__ as { users: DBUser[]; inventories: DBInventory[] };
