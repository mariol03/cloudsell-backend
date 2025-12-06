import { ItemInMemoryRepository } from '@items/infrastructure/item-inmemory.repository';
import { ItemCreateUseCase } from './create/item-create.use-case';
import { ItemUpdateUseCase } from './update/item-update.use-case';
import { ItemGetAllCase } from './get-all/item-get-all.use-case';
import { CategoryEntity } from '@items/category/domain/category.entity';

describe('Item filters and pagination', () => {
  let repo: ItemInMemoryRepository;
  let create: ItemCreateUseCase;
  let getAll: ItemGetAllCase;

  beforeEach(() => {
    repo = new ItemInMemoryRepository();
    create = new ItemCreateUseCase(repo);
    getAll = new ItemGetAllCase(repo);
  });

  it('filters by categoryId', async () => {
    const catA = new CategoryEntity('A');
    const catB = new CategoryEntity('B');

    const i1 = await create.execute({ name: 'i1', description: 'one' });
    i1.addCategory(catA);
    await repo.update(i1);

    const i2 = await create.execute({ name: 'i2', description: 'two' });
    i2.addCategory(catB);
    await repo.update(i2);

    const res = await getAll.execute({ categoryId: catA.id });
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('i1');
  });

  it('filters by min/max price', async () => {
    const a = await create.execute({ name: 'p1', description: 'one' });
    a.price = 10;
    await repo.update(a);

    const b = await create.execute({ name: 'p2', description: 'two' });
    b.price = 50;
    await repo.update(b);

    const c = await create.execute({ name: 'p3', description: 'three' });
    c.price = 100;
    await repo.update(c);

    const res = await getAll.execute({ minPrice: 20, maxPrice: 80 });
    expect(res.map(r => r.name).sort()).toEqual(['p2']);
  });

  it('paginates results', async () => {
    // create 5 items
    for (let i = 1; i <= 5; i++) {
      const it = await create.execute({ name: `item${i}`, description: `desc${i}` });
      it.price = i;
      await repo.update(it);
    }

    const page1 = await getAll.execute({ page: 1, pageSize: 2 });
    expect(page1.length).toBe(2);
    expect(page1[0].name).toBe('item1');

    const page3 = await getAll.execute({ page: 3, pageSize: 2 });
    expect(page3.length).toBe(1);
    expect(page3[0].name).toBe('item5');
  });
});
