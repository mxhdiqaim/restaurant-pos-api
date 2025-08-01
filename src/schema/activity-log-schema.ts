import {
    pgTable,
    text,
    timestamp,
    uuid,
    pgEnum,
    boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users-schema";
import { stores } from "./stores-schema";

// Define the types of actions you want to track
export const activityActionEnum = pgEnum("activityAction", [
    "USER_LOGIN",
    "USER_CREATED",
    "STORES_VIEWED",
    "STORE_CREATED",
    "STORE_VIEWED",
    "STORE_UPDATED",
    "STORE_DELETED",
    "MENU_ITEM_CREATED",
    "MENU_ITEM_UPDATED",
    "MENU_ITEM_DELETED",
    "ORDER_CREATED",
    "ORDER_STATUS_UPDATED",
    "ORDER_DELETED",
    "MANAGER_REGISTERED",
    "USERS_VIEWED",
    "USER_VIEWED",
    "USER_DELETED",
    "USER_UPDATED",
    "PASSWORD_CHANGED",
]);

export const entityTypeEnum = pgEnum("entityType", [
    "order",
    "menuItem",
    "user",
    "store",
    "activity",
]);

export const activityLog = pgTable("activityLog", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").references(() => users.id, { onDelete: "set null" }),
    storeId: uuid("storeId").references(() => stores.id, {
        onDelete: "cascade",
    }),
    action: activityActionEnum("action").notNull(),
    entityId: text("entityId"), // e.g., the ID of the order or menu item
    entityType: entityTypeEnum("entityType").notNull().default("activity"), // e.g., 'order', 'menuItem'
    details: text("details").notNull(), // e.g., "User John Doe created order #ORD-123"
    isRead: boolean("isRead").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});
