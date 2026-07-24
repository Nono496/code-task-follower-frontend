import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(seconds: number): string {
        seconds = Math.round(seconds);

        const s = seconds % 60;
        const m = ((seconds - s) / 60) % 60;
        const h = (seconds - s - m * 60) / 3600;
        return (h > 0 ? h + 'h ' : '') + `${m}m ${s}s`;
    }
}