export class Tag {

    private static tags: {
        [key: string]: {
            bgColor: string,
            textColor: string
        }
    } = {
        swift: {
            bgColor: 'bg-yellow-400',
            textColor: 'text-yellow-400',
        },
        combine: {
            bgColor: 'bg-purple-400',
            textColor: 'text-purple-400',
        },
        laravel: {
            bgColor: 'bg-red-400',
            textColor: 'text-red-400',
        }
    }

    static exists(tag: string): Boolean {
        return Tag.tags[tag] != null;
    }

    static bgColor(tag: string): string {
        return Tag.tags[tag].bgColor;
    }

    static textColor(tag: string): string {
        return Tag.tags[tag].textColor;
    }

    static allTags(): string[] {
        return Object.keys(Tag.tags);
    }
}
