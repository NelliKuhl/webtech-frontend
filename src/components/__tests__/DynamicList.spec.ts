import { describe, it, expect, vi, beforeEach, test } from 'vitest'

import {shallowMount, flushPromises, mount} from '@vue/test-utils'
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
  const twofilledlist: List[] = [
    { id: 1, name: 'Einkaufsliste', owner: email},
    { id: 2, name: 'Einkaufsliste2', owner: email}
  ]

  vi.mock('axios')
  vi.mock('@okta/okta-vue', () => {
    return { useAuth: () => ({ getUser: vi.fn() })}
  });


  /**
   * Testet, ob die Komponente existiert.
   */
  it('mounts correctly', () => {
    const wrapper = mount(DynamicList);
    expect(wrapper.exists()).toBe(true);
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
   * Testet, ob eine Liste aus dem backend gerendert wird.
   */
  it('should render a list from the backend', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: onefilledlist })

    const wrapper = shallowMount(DynamicList)

    await flushPromises()

    expect(wrapper.text()).toContain('Einkaufsliste')
  })

  /**
   *   Test für die Auswahl einer Liste:
   *   Überprüfe, ob das Ändern der ausgewählten Liste die Zutatenliste aktualisiert.
   */
    it('should update the list of ingredients when a list is selected', async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({data: twofilledlist})
      vi.mocked(axios, true).get.mockResolvedValueOnce({data: oneZutat})

      const wrapper = shallowMount(DynamicList)

      await flushPromises()

      const list = wrapper.find('.dropdown-menu1')
      await list.trigger('change')

      expect(wrapper.text()).toContain('Einkaufsliste2')
    })

})