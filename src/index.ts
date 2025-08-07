import {
    createPrompt,
    isDownKey,
    isEnterKey,
    isSpaceKey,
    isUpKey,
    makeTheme,
    Separator,
    Status,
    useKeypress,
    useMemo,
    usePagination,
    usePrefix,
    useRef,
    useState,
    ValidationError
} from "@inquirer/core";
import figures from "@inquirer/figures";
import ansiEscapes from "ansi-escapes";
import chalk from "chalk";
import { isSelectable, isChecked } from "./utils/helper.js";
import type {
    CheckboxSortConfig,
    CheckboxSortTheme,
    Item,
    NormalizedChoice
} from "./typings/index.js";

const checkboxSortTheme: CheckboxSortTheme = {
    icon: {
        cursor: figures.pointer,
    },
    style: {
        disabledChoice: (text) => chalk.dim(`- ${text}`),
        description: (text) => chalk.cyan(`(${text})`),
        selectedOrder: (text) => chalk.greenBright.bold(text),
        unselectedOrder: (text) => chalk.dim(text),
        renderSelectedChoices: (selectedChoices) => selectedChoices.map(choice => choice.name || choice.value).join(", "),

    },
    helpMode: "auto"
}

const normalizedChoices = <Value>(
    choices: ReadonlyArray<Item<Value> | Separator> | ReadonlyArray<string | Separator>
): ReadonlyArray<NormalizedChoice<Value> | Separator> => {
    return choices.map((choice: string | Separator | Item<Value>) => {
        if (Separator.isSeparator(choice)) return choice;
        if (typeof choice === "string") {
            return {
                name: choice,
                value: choice,
                short: choice,
                disabled: false,
                checked: false,
                order: 0
            } as NormalizedChoice<Value>;
        }
        const name = choice.name || String(choice.value);
        const normalizedChoice = {
            name,
            value: choice.value,
            description: choice.description,
            short: choice.short || name,
            disabled: choice.disabled || false,
            checked: choice.checked || false,
            order: choice.order || 0
        }
        return normalizedChoice
    })
}

const orderedCheckbox = createPrompt(
    <Value extends unknown>(
        config: CheckboxSortConfig<Value>,
        done: (value: Array<Value>) => void
    ) => {
        const {
            instructions,
            pageSize = 7,
            choices,
            loop = true,
            required,
            validate = () => true,
        } = config;
        const theme = makeTheme<CheckboxSortTheme>(checkboxSortTheme, config.theme);
        const firstRender = useRef(true);
        const [status, setStatus] = useState<Status>("idle");
        const prefix = usePrefix({ status, theme });
        const [items, setItems] = useState<ReadonlyArray<NormalizedChoice<Value> | Separator>>(
            normalizedChoices<Value>(choices)
        );

        const bounds = useMemo(() => {
            const first = items.findIndex(isSelectable)
            const last = items.findLastIndex(isSelectable)

            if (first < 0) throw new ValidationError("[checkbox prompt] No selectable items found");
            return { first, last };
        }, [items]);

        const [active, setActive] = useState<number>(bounds.first);
        const [nextOrder, setNextOrder] = useState<number>(1);
        const [showTips, setShowTips] = useState<boolean>(true);
        const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

        useKeypress(async (key) => {
            if (isEnterKey(key)) {
                const selectedItems = items
                    .filter(isChecked);
                const isValid = await validate(selectedItems);
                if (required && selectedItems.length === 0) {
                    setErrorMessage("At least one item must be selected");
                } else if (isValid === true) {
                    setStatus("done");
                    done(selectedItems.sort((a, b) => a.order - b.order).map(item => item.value));
                } else {
                    setErrorMessage(isValid || "Invalid selection");
                }
            } else if (isUpKey(key) || isDownKey(key)) {
                if (
                    loop
                    || (isUpKey(key) && active !== bounds.first)
                    || (isDownKey(key) && active !== bounds.last)
                ) {
                    const offset = isUpKey(key) ? -1 : 1;
                    let nextActive = active;
                    do {
                        nextActive = (nextActive + offset + items.length) % items.length;
                    } while (!isSelectable(items[nextActive]!));
                    setActive(nextActive);
                }
            } else if (isSpaceKey(key)) {
                setErrorMessage(undefined);
                setShowTips(false);

                const currentItem = items[active];
                if (!currentItem) return;

                if (isChecked(currentItem)) {
                    // Deselecting: reset order and adjust others
                    const removedOrder = currentItem.order;
                    setNextOrder(nextOrder - 1);

                    setItems(items.map((item, index) => {
                        if (index === active) {
                            return {
                                ...item,
                                checked: false,
                                order: 0
                            };
                        } else if (isChecked(item) && item.order > removedOrder) {
                            // Adjust order of items that were selected after the deselected item
                            return {
                                ...item,
                                order: item.order - 1
                            };
                        }
                        return item;
                    }))
                } else {
                    // Selecting: assign next order
                    const newOrder = nextOrder
                    setNextOrder(nextOrder + 1);

                    setItems(items.map((item, index) => {
                        if (index === active) {
                            return {
                                ...item,
                                checked: true,
                                order: newOrder
                            };
                        }
                        return item;
                    }));
                }
            }
        });

        const message = theme.style.message(config.message, status);
        let description: string | undefined;
        const page = usePagination<NormalizedChoice<Value> | Separator>({
            items,
            active,
            renderItem: ({ item, isActive }) => {
                if (Separator.isSeparator(item)) return ` ${item.separator}`;
                if (item.disabled) {
                    const disabledLabel = typeof item.disabled === "string" ? item.disabled : "(disabled)";
                    return theme.style.disabledChoice(`${item.name} ${disabledLabel}`);
                }
                if (isActive) {
                    description = item.description
                }

                let orderIcon = isChecked(item) ? theme.style.selectedOrder(`[${item.order}]`) : theme.style.unselectedOrder(`[ ]`);
                const color = isActive ? theme.style.highlight : (x: string) => x;
                const cursor = isActive ? theme.icon.cursor : " ";
                return color(`${cursor} ${orderIcon} ${item.name}`);
            },
            pageSize,
            loop,
        })

        if (status === "done") {
            const selection = items.filter(isChecked).sort((a, b) => a.order - b.order);
            const answer = theme.style.answer(theme.style.renderSelectedChoices(selection, items));
            return ` ${prefix} ${message} ${answer}`;
        }

        let helpTipTop = "";
        let helpTipBottom = "";
        if (
            theme.helpMode === "always"
            || (
                theme.helpMode === "auto" && showTips
                && (instructions === undefined || instructions)
            )
        ) {
            if (instructions) {
                helpTipTop = instructions;
            } else {
                const keys = [
                    `${theme.style.key('space')} to select`,
                    `and ${theme.style.key('enter')} to proceed`,
                ];
                helpTipTop = ` (Press ${keys.filter((key) => key !== '').join(', ')})`;
            }

            if (
                items.length > pageSize
                && (theme.helpMode === "always" || (theme.helpMode === "auto" && firstRender.current))
            ) {
                helpTipBottom = `\n${theme.style.help('(Use arrow keys to reveal more choices)')}`;
                firstRender.current = false;
            }
        }
        const choiceDescription = description
            ? `\n${theme.style.description(description)}`
            : "";

        let error = "";
        if (errorMessage) {
            error = `\n${theme.style.error(errorMessage)}`;
        }

        return `${prefix} ${message}${helpTipTop}\n${page}${helpTipBottom}${choiceDescription}${error}${ansiEscapes.cursorHide}`;
    }
)

export { orderedCheckbox };
export default orderedCheckbox;
export { Separator } from "@inquirer/core";