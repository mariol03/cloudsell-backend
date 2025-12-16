import { ItemCreateUseCase } from "./create/item-create.use-case";
import { ItemUpdateUseCase } from "./update/item-update.use-case";
import { ItemDeleteUseCase } from "./delete/item-delete.use-case";
import { ItemInMemoryRepository } from "@items/infrastructure/item-inmemory.repository";
import { InvalidItemDataException } from "@items/domain/exceptions/invalid-item-data.exception";
import { ItemAlreadyExistsException } from "@items/domain/exceptions/item-already-exists.exception";
import { ItemNotFoundException } from "@items/domain/exceptions/item-not-found.exception";

describe("Item Use-Cases", () => {
    let repo: ItemInMemoryRepository;

    beforeEach(() => {
        repo = new ItemInMemoryRepository();
    });

    describe("Create Item", () => {
        it("should create an item successfully", async () => {
            const useCase = new ItemCreateUseCase(repo);
            const item = await useCase.execute({
                name: "Test Item",
                description: "A test item",
                price: 10.99,
                image: "https://example.com/image.jpg",
            });

            expect(item).toBeDefined();
            expect(item.name).toBe("Test Item");
            expect(item.description).toBe("A test item");
            expect(item.id).toBeDefined();
        });

        it("should throw InvalidItemDataException when data is missing", async () => {
            const useCase = new ItemCreateUseCase(repo);
            await expect(
                useCase.execute({
                    name: "",
                    description: "",
                    price: 10.99,
                    image: "",
                }),
            ).rejects.toThrow(InvalidItemDataException);
        });

        it("should throw ItemAlreadyExistsException when name duplicates", async () => {
            const useCase = new ItemCreateUseCase(repo);
            await useCase.execute({
                name: "Test Item",
                description: "A test item",
                price: 10.99,
                image: "https://example.com/image.jpg",
            });
            await expect(
                useCase.execute({
                    name: "Test Item",
                    description: "A test item",
                    price: 10.99,
                    image: "https://example.com/image.jpg",
                }),
            ).rejects.toThrow(ItemAlreadyExistsException);
        });
    });

    describe("Update Item", () => {
        it("should update an existing item", async () => {
            const create = new ItemCreateUseCase(repo);
            const created = await create.execute({
                name: "Test Item",
                description: "A test item",
                price: 10.99,
                image: "https://example.com/image.jpg",
            });

            const update = new ItemUpdateUseCase(repo);
            const updated = await update.execute({
                id: created.id,
                name: "Updated",
                description: "newdesc",
            });

            expect(updated).toBeDefined();
            expect(updated.name).toBe("Updated");
            expect(updated.description).toBe("newdesc");
        });

        it("should throw InvalidItemDataException when id is missing", async () => {
            const update = new ItemUpdateUseCase(repo);
            // @ts-ignore intentional incorrect payload
            await expect(update.execute({})).rejects.toThrow(
                InvalidItemDataException,
            );
        });

        it("should throw ItemNotFoundException for non-existing id", async () => {
            const update = new ItemUpdateUseCase(repo);
            await expect(
                update.execute({ id: "non-existent", name: "x" }),
            ).rejects.toThrow(ItemNotFoundException);
        });
    });

    describe("Delete Item", () => {
        it("should delete an existing item", async () => {
            const create = new ItemCreateUseCase(repo);
            const created = await create.execute({
                name: "Test Item",
                description: "A test item",
                price: 10.99,
                image: "https://example.com/image.jpg",
            });

            const del = new ItemDeleteUseCase(repo);
            const deleted = await del.execute({ id: created.id });

            expect(deleted).toBeDefined();
            expect(deleted?.id).toBe(created.id);
            // Verify it no longer exists
            const found = await repo.findById(created.id);
            expect(found).toBeNull();
        });

        it("should throw InvalidItemDataException when id is missing", async () => {
            const del = new ItemDeleteUseCase(repo);
            // @ts-ignore intentional incorrect payload
            await expect(del.execute({})).rejects.toThrow(
                InvalidItemDataException,
            );
        });

        it("should throw ItemNotFoundException for non-existing id", async () => {
            const del = new ItemDeleteUseCase(repo);
            await expect(del.execute({ id: "no-id" })).rejects.toThrow(
                ItemNotFoundException,
            );
        });
    });
});
