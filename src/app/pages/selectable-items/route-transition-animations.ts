import { trigger, transition, style, query, animateChild, animate, group } from '@angular/animations';

export const routeTransitionAnimations = trigger('triggerName', [
    transition('One => Two, Two => Three, Three => Four, Four => Five, Five => Six, Five => Seven, Six => Seven', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%'
            })
        ]),
        query(':enter', [style({ right: '-100%', opacity: 0 })]),
        query(':leave', animateChild()),
        group([
            query(':leave', [animate('0.5s ease-out', style({ right: '100%', opacity: 0 }))]),
            query(':enter', [animate('0.5s ease-out', style({ right: '0%', opacity: 1 }))])
        ]),
        query(':enter', animateChild())
    ]),
    transition('Seven => Six, Six => Five, Five => Four, Four => Three, Three => Two, Two => One, Three => One, Four => One, Five => One, Six => One, Seven => One, Five => Two', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
            })
        ]),
        query(':enter', [style({ left: '-100%', opacity: 0 })]),
        query(':leave', animateChild()),
        group([
            query(':leave', [animate('0.5s ease-out', style({ left: '100%', opacity: 0 }))]),
            query(':enter', [animate('0.5s ease-out', style({ left: '0%', opacity: 1 }))])
        ]),
        query(':enter', animateChild())
    ])
]);