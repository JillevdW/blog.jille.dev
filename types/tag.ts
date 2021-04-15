export class Tag {

    private static tags: {
        [key: string]: {
            color: string
        }
    } = {
        swift: {
            color: 'yellow-400',
        },
        combine: {
            color: 'purple-400',
        },
        laravel: {
            color: 'red-400'
        }
    }

    static exists(tag: string): Boolean {
        return Tag.tags[tag] != null;
    }

    static color(tag: string): string {
        return Tag.tags[tag].color;
    }

    static allTags(): string[] {
        return Object.keys(Tag.tags);
    }
}
