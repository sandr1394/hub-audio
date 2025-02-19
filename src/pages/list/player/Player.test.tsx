import * as React from 'react';
import { mount } from '@cypress/react';
import { ThemeProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import { MemoryRouter, Route } from 'react-router-dom';
import Player from './Player';
import CacheContextProvider from '../../../utils/CacheContextProvider';
import useAudio from '../../../utils/useAudio';
import { player } from '../../../../cypress/support/selectors';
import NetworkService from '../../../network-service';
import { Source } from '../../../types';

describe('Player', () => {
  let audioResolve: () => void;

  before(() => {
    NetworkService.setupInterceptors();
  });

  beforeEach(() => {
    const audioPromise = new Promise<void>((resolve) => {
      audioResolve = resolve;
    });
    cy.intercept(
      'GET',
      '/audio/api/v1/interactions/getaudio/343',
      cy
        .stub()
        .as('getAudio')
        .callsFake((req) =>
          audioPromise.then(() => {
            req.reply({ statusCode: 200, fixture: 'testaudio.mp3' });
          }),
        ),
    );
    cy.intercept(
      'GET',
      '/audio/api/v1/five9/getaudio/1570',
      cy
        .stub()
        .as('getAudio')
        .callsFake((req) =>
          audioPromise.then(() => {
            req.reply({ statusCode: 200, fixture: 'testaudio.mp3' });
          }),
        ),
    );
  });

  const render = (source: Source) => {
    const theme = createTheme({});
    function Wrapper() {
      const { play } = useAudio();
      const item =
        source === Source.FIVE9
          ? {
              id: 1570,
              callId: '25888706',
              sessionId: 'C9830B6B78A3441291ED06BE68E67C99',
              ani: '8666156319',
              agentFirstName: 'Jack',
              agentLastName: 'Black',
              agentEmail: 'jb@test.com',
              campaign: 'Verification Outbound',
              dateOfCall: '2021-08-30T09:47:39.000Z',
              callDuration: 27,
            }
          : {
              id: 343,
              callId: '2021042800000047919',
              segmentId: '173cae2265eb22e7dec288e2d0e3955b',
              ani: '19783137000',
              dateOfCall: '2021-04-28T20:30:51.229Z',
              callDuration: 27,
            };
      return (
        <>
          <button id="test-play" type="button" onClick={() => play(item)}>
            Play
          </button>
          <Player />
        </>
      );
    }
    return mount(
      <ThemeProvider theme={theme}>
        <CacheContextProvider>
          <MemoryRouter initialEntries={[`/audio/list/${source}`]}>
            <Route path="/audio/list/:source" component={Wrapper} />
          </MemoryRouter>
        </CacheContextProvider>
      </ThemeProvider>,
    );
  };

  it('should be disabled', () => {
    render(Source.INTERACTIONS);
    cy.get(player.info).should('have.text', 'No call selected.');
    cy.get(player.volume).should('be.disabled');
    cy.get(player.replay10).should('be.disabled');
    cy.get(player.play).should('be.disabled');
    cy.get(player.pause).should('not.exist');
    cy.get(player.forward10).should('be.disabled');
    cy.get(player.rate).should('be.disabled');
    cy.get(player.currentTime).should('have.text', '00:00');
    cy.get(player.sliderInput).should('be.disabled').and('have.value', '0');
    cy.get(player.duration).should('have.text', '');
  });

  it('should loading', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play').click();
    cy.get(player.info).should('not.contain', 'No call selected.');
    cy.get(player.info).should('contain', '2021042800000047919');
    cy.get(player.volume).should('be.disabled');
    cy.get(player.replay10).should('be.disabled');
    cy.get(player.play).should('be.disabled');
    cy.get(player.pause).should('not.exist');
    cy.get(player.forward10).should('be.disabled');
    cy.get(player.rate).should('be.disabled');
    cy.get(player.currentTime).should('have.text', '00:00');
    cy.get(player.sliderInput).should('be.disabled').and('have.value', '0');
    cy.get(player.duration)
      .should('have.text', '00:27')
      .then(() => audioResolve());

    cy.get(player.volume).should('be.enabled');
    cy.get(player.replay10).should('be.enabled');
    cy.get(player.play).should('not.exist');
    cy.get(player.pause).should('be.enabled');
    cy.get(player.forward10).should('be.enabled');
    cy.get(player.rate).should('be.enabled');
    cy.get(player.sliderInput).should('be.enabled');
    cy.get(player.pause).click();
    cy.get(player.play).should('be.enabled');
    cy.get(player.pause).should('not.exist');
  });

  it('should show interactions info', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play').click();
    cy.get(player.info).should('contain', '2021042800000047919-173cae2265eb22e7dec288e2d0e3955b');
    cy.get(player.info).should('contain', 'ANI: +1 (978) 313-7000');
    cy.get(player.info)
      .should('contain', 'Time of call: 04/28/2021 16:30:51')
      .then(() => audioResolve());
    cy.get(player.pause).click();
  });

  it('should show five9 info', () => {
    render(Source.FIVE9);
    cy.get('#test-play').click();
    cy.get(player.info).should('contain', '25888706-C9830B6B78A3441291ED06BE68E67C99');
    cy.get(player.info).should('contain', 'ANI: (866) 615-6319 / Agent: Jack Black');
    cy.get(player.info)
      .should('contain', 'Time of call: 08/30/2021 05:47:39')
      .then(() => audioResolve());
    cy.get(player.pause).click();
  });

  it('should change time', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play')
      .click()
      .then(() => audioResolve());
    cy.get(player.currentTime).should('have.text', '00:02');
    cy.get(player.sliderInput).should('have.value', '2');
    cy.get(player.pause).click();
  });

  it('should add 10 secs', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play')
      .click()
      .then(() => audioResolve());
    cy.get(player.forward10).click();
    cy.get(player.sliderInput)
      .invoke('val')
      .then((value) => {
        if (typeof value !== 'string') throw new Error('sliderInput value should be a string');
        expect(+value).be.greaterThan(9);
        cy.get(player.currentTime).should('have.text', `00:${value}`);
      });
    cy.get(player.pause).click();
    cy.get(player.forward10).click();
    cy.get(player.sliderInput)
      .invoke('val')
      .then((value) => {
        if (typeof value !== 'string') throw new Error('sliderInput value should be a string');
        expect(+value).be.greaterThan(19);
        cy.get(player.currentTime).should('have.text', `00:${value}`);
      });
  });

  it('should end audio if forward goes to the end of audio', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play')
      .click()
      .then(() => audioResolve());
    cy.get(player.forward10).click();
    cy.get(player.forward10).click();
    cy.get(player.forward10).click();
    cy.get(player.play).should('be.enabled');
    cy.get(player.pause).should('not.exist');
    cy.get(player.currentTime).should('have.text', `00:27`);
    cy.get(player.sliderInput).should('have.value', '27');
  });

  it('should replay', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play')
      .click()
      .then(() => audioResolve());
    cy.get(player.forward10).click();
    cy.get(player.forward10).click();
    cy.get(player.replay10).click();
    cy.get(player.sliderInput)
      .invoke('val')
      .then((value) => {
        if (typeof value !== 'string') throw new Error('sliderInput value should be a string');
        expect(+value).be.greaterThan(9);
        expect(+value).be.lessThan(19);
        cy.get(player.currentTime).should('have.text', `00:${value}`);
      });
    cy.get(player.pause).click();
    cy.get(player.replay10).click();
    cy.get(player.sliderInput)
      .invoke('val')
      .then((value) => {
        if (typeof value !== 'string') throw new Error('sliderInput value should be a string');
        expect(+value).be.lessThan(9);
        cy.get(player.currentTime).should('have.text', `00:0${value}`);
      });
  });

  it('should change time on sliderInput change', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play')
      .click()
      .then(() => audioResolve());
    cy.get(player.sliderInput).should('be.enabled');
    cy.get(player.sliderRail).click();
    cy.get(player.sliderInput)
      .invoke('val')
      .then((value) => {
        if (typeof value !== 'string') throw new Error('sliderInput value should be a string');
        expect(+value).be.greaterThan(13);
        cy.get(player.currentTime).should('have.text', `00:${value}`);
      });
    cy.get(player.pause).click();
  });

  it('should end audio on sliderInput click at the end', () => {
    render(Source.INTERACTIONS);
    cy.get('#test-play')
      .click()
      .then(() => audioResolve());
    cy.get(player.sliderInput).should('be.enabled');
    cy.get(player.sliderRail).click('right');
    cy.get(player.play).should('be.enabled');
    cy.get(player.pause).should('not.exist');
    cy.get(player.currentTime).should('have.text', `00:27`);
    cy.get(player.sliderInput).should('have.value', '27');
  });
});
