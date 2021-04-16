export function getRandomColorClassName(): string {
    const classNames = ['text-blue-600', 'text-yellow-400', 'text-purple-600', 'text-green-400'];
    return classNames[getRandomInt(0, classNames.length)];
}
    
function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}