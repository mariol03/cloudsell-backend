import { WishlistInMemoryRepository } from '@wishlist/infrastructure/wishlist-inmemory.repository';
import { WishlistCreateUseCase } from '@wishlist/application/use-cases/create/wishlist-create.use-case';
import { WishlistAddItemUseCase } from '@wishlist/application/use-cases/add-item/wishlist-add-item.use-case';
import { WishlistRemoveItemUseCase } from '@wishlist/application/use-cases/remove-item/wishlist-remove-item.use-case';
import { WishlistGetUseCase } from '@wishlist/application/use-cases/get/wishlist-get.use-case';
import { ItemInMemoryRepository } from '@items/infrastructure/item-inmemory.repository';
import { ItemCreateUseCase } from '@items/application/use-cases/create/item-create.use-case';

describe('Wishlist use-cases', () => {
  let wishlistRepo: WishlistInMemoryRepository;
  let itemRepo: ItemInMemoryRepository;
  let createUse: WishlistCreateUseCase;
  let addUse: WishlistAddItemUseCase;
  let removeUse: WishlistRemoveItemUseCase;
  let getUse: WishlistGetUseCase;
  let itemCreate: ItemCreateUseCase;

  beforeEach(() => {
    wishlistRepo = new WishlistInMemoryRepository();
    itemRepo = new ItemInMemoryRepository();
    createUse = new WishlistCreateUseCase(wishlistRepo);
    addUse = new WishlistAddItemUseCase(wishlistRepo, itemRepo);
    removeUse = new WishlistRemoveItemUseCase(wishlistRepo);
    getUse = new WishlistGetUseCase(wishlistRepo);
    itemCreate = new ItemCreateUseCase(itemRepo);
  });

  it('creates and retrieves a wishlist', async () => {
    const w = await createUse.execute('user1');
    expect(w).toBeDefined();
    const got = await getUse.execute('user1');
    expect(got).toBeDefined();
    expect(got!.ownerId).toBe('user1');
  });

  it('adds and removes items from wishlist', async () => {
    const item = await itemCreate.execute({ name: 'wishitem', description: 'desc' });
    await createUse.execute('user2');
    const afterAdd = await addUse.execute('user2', item.id);
    expect(afterAdd.items.length).toBe(1);
    expect(afterAdd.items[0].id).toBe(item.id);

    const afterRemove = await removeUse.execute('user2', item.id);
    expect(afterRemove.items.length).toBe(0);
  });

  it('throws when removing from non-existing wishlist', async () => {
    await expect(removeUse.execute('noexist', 'id')).rejects.toThrow();
  });
});
