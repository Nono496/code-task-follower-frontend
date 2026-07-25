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
        let result = s+'s';
        if(seconds >= 60){
            result=m+'m '+result;
            if(seconds >= 3600){
                result=h+'h '+result;
            }
        }
        return result;
    }
}