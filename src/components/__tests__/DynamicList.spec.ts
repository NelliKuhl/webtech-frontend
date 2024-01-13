import { describe, it, expect, vi } from 'vitest'

import { shallowMount, flushPromises} from '@vue/test-utils'
import DynamicList from '@/components/DynamicList.vue'
import type { List, Zutat } from '@/types'
import axios from 'axios'
import { ref } from 'vue'
import { before } from 'node:test'




describe('DynamicList', () => {
  const $auth = ref({ isAuthenticated: true })
  const email = "email@test.de"
  const emptyZutat: Zutat[] = []
  const twoZutat: Zutat[] = [
    { id: 1, zutat: 'Apfel', menge: 42, einheit: 'kg'},
    { id: 2, zutat: 'Milch', menge: 13, einheit: 'Stück'}]
  const oneZutat: Zutat[] = [
    { id: 1, zutat: 'Apfel', menge: 42, einheit: 'Gramm'}
  ]
  const emptylist: List[] = []
  const onefilledlist: List[] = [
    { id: 1, name: 'Einkaufsliste', owner: email}
  ]

  vi.mock('axios')
  vi.mock('@okta/okta-vue', () => {
    return { useAuth: () => ({ getUser: vi.fn() })}
  });



  /**
   * Testet, ob eine Nachricht angezeigt wird, wenn keine Items vom Backend empfangen werden.
   */
  it('should display message when no items are received from backend', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: emptyZutat })

    const wrapper = shallowMount(DynamicList)

    await flushPromises()

    expect(wrapper.text()).toContain('Liste Leer')
  })



  /**
  *   Test für das Hinzufügen einer Zutat:
   *   Überprüfe, ob das Hinzufügen einer Zutat die Zutatenliste aktualisiert.
  */

  /**
  *   Test für das Löschen einer Zutat:
   *   Überprüfe, ob das Löschen einer Zutat die Zutatenliste korrekt aktualisiert.
  */

  /**
   *  Test für das Hinzufügen einer Liste:
   *  Überprüfe, ob das Hinzufügen einer Liste die Listenliste (ja, das klingt komisch) aktualisiert.
   */

  /**
  *   Test für das Löschen einer Liste:
   *   Überprüfe, ob das Löschen einer Liste die Listenliste korrekt aktualisiert und auch die dazugehörigen Zutaten löscht.
  */


  /**
  *   Test für die Anzeige von Zutaten:
   *   Überprüfe, ob die Zutaten korrekt auf der Oberfläche angezeigt werden, wenn sie vorhanden sind.
  */


  /**
  *   Test für die Auswahl einer Liste:
   *   Überprüfe, ob das Ändern der ausgewählten Liste die Zutatenliste aktualisiert.
  */

  /**
  *   Test für die Verhinderung des Buchstabens 'e':
   *   Überprüfe, ob das Eingeben des Buchstabens 'e' in das Menge-Feld verhindert wird.
  */

  /**
  *   Test für Verhinderung von zu hoher Eingabe
  */

  /**
  *   Test für Verhinderung von - Eingaben
  */

})