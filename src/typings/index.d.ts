import { Theme, Separator } from "@inquirer/core";
import { PartialDeep } from "@inquirer/type";

type MaybePromise<T> = T | Promise<T>;
export type Item<Value> = Choice<Value>;

export type CheckboxSortTheme = {
    icon: {
        cursor: string;
    };
    style: {
        disabledChoice: (text: string) => string;
        description: (text: string) => string;
        selectedOrder: (text: string) => string;
        unselectedOrder: (text: string) => string;
        renderSelectedChoices: <T>(selectedChoices: ReadonlyArray<NormalizedChoice<T>>, allChoices: ReadonlyArray<NormalizedChoice<T> | Separator>) => string;
    };
    helpMode: "always" | "never" | "auto";
}

export interface Choice<Value> {
    name?: string;
    value: Value;
    description?: string | undefined;
    short?: string;
    disabled?: boolean | string;
}

export interface NormalizedChoice<Value> extends Choice<Value> {
    name: string;
    short: string;
    disabled: boolean | string;
    checked: boolean;
    order: number;
};


export interface CheckboxSortConfig<Value> {
    message: string;
    prefix?: string;
    pageSize?: number;
    instructions?: string;
    choices: ReadonlyArray<Item<Value> | Separator> | ReadonlyArray<string | Separator>;
    default?: ReadonlyArray<Value>;
    loop?: boolean;
    required?: boolean;
    validate?: ((value: ReadonlyArray<Choice<Value>>) => MaybePromise<boolean | string>);
    theme?: PartialDeep<Theme<CheckboxSortTheme>>;
}