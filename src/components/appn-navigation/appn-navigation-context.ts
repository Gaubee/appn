/// <reference types="@types/dom-navigation"/>

import {createContext} from '@lit/context';
import type {AppnNavigationProviderElement} from './appn-navigation';
import type {AppnNavigation} from './appn-navigation-types';

/**
 *
 * navigation API
 */
export const appnNavigationContext = createContext<AppnNavigation<AppnNavigationProviderElement> | null>(Symbol('appn-navigation'));

export const appnNavigationHistoryEntryContext = createContext<NavigationHistoryEntry | null>(Symbol('appn-navigation-history-entry'));
