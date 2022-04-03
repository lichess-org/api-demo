import { h } from 'snabbdom';
import { Renderer } from '../interfaces';

export const renderRequest: Renderer = _ => [h('div', h('h1', 'Make arbitrary API requests'))];
