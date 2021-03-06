import React from 'react';
import { Validation } from './validation';
import { createSetter, createSubSection } from '../utils';
import PageLookup from '../PageLookup';
import WikiButton from '../WikiButton';
import { withTranslation } from '../../translate';
import TemplatePreview from '../TemplatePreview';

class TemplatePage extends React.Component {
   constructor(props) {
      super(props);
      this.set = createSetter();
      this.template = createSubSection(this, 'template');
   }

   addArg() {
      const { value, onChange } = this.template.props;
      value.args.push({});
      onChange({ ...value });
   }

   deleteArg(arg) {
      const { value, onChange } = this.template.props;
      const index = value.args.indexOf(arg);
      if (index !== -1) {
         value.args.splice(index, 1);
      }
      onChange({ ...value });
   }

   onEnable(enabled) {
      if (enabled) {
         this.set('template', this._value || {
            name: '',
            talkPage: true,
            args: [],
         });
      } else {
         this._value = { ...this.props.value.template };
         this.set('template', null);
      }
   }

   render() {
      const { translation: { tr }, value: { template } } = this.props;
      const enabled = !!template;

      return <div className='page TemplatePage'>
         <label id='add'>
            <input
               type='checkbox'
               checked={enabled}
               onChange={e => this.onEnable(e.target.checked)} />
            <span>{tr('autoAdd')}</span>
         </label>
         {enabled && this.renderRest()}
      </div>;
   }

   renderArg(arg, id) {
      const onChange = (e, p) => {
         const { value, onChange } = this.template.props;
         const val = e.target.value;
         arg[p] = val ? val : null;
         onChange({ ...value });
      }

      return <div className='arg' key={id}>
         <input id={`${id}-name`} value={arg.name || ''} onChange={e => onChange(e, 'name')} />
         <span>{'='}</span>
         <Validation isEmpty={() => !arg.value}>
            <input id={`${id}-value`} value={arg.value || ''} onChange={e => onChange(e, 'value')} />
         </Validation>
         <WikiButton className='delete' onClick={() => this.deleteArg(arg)} />
      </div>;
   }

   renderRest() {
      const {
         translation: { tr },
         value: { template: { name, args }, wiki },
      } = this.props;
      return (<div>
         <div className='field' id='template'>
            <label htmlFor='name'>{tr('name')}</label>
            <Validation isEmpty={() => !name}>
               {this.template.bind('name', <PageLookup
                  inputProps={{ id: 'name' }}
                  ns={10}
                  wiki={wiki} />)}
            </Validation>
         </div>
         <div id='placement' className='field'>
            <header>{tr('placement')}</header>
            <label>
               {this.template.bind('talkPage', <input type='radio' name='talkPage' value={false} />)}
               <span>{tr('inArticle')}</span>
            </label>
            <label>
               {this.template.bind('talkPage', <input type='radio' name='talkPage' value={true} />)}
               <span>{tr('onTalkPage')}</span>
            </label>
         </div>
         <div id='args'>
            <header>{tr('args')}</header>
            <div className='args'>
               {args.map((arg, id) => this.renderArg(arg, id))}
            </div>
            <WikiButton onClick={() => this.addArg()}>{tr('add')}</WikiButton>
         </div>
         <div id='preview'>
            <header>{tr('preview')}</header>
            <TemplatePreview name={name} args={args} labelFor={(id, isName) => id === null ? 'name' : `${id}-${isName ? 'name' : 'value'}`} />
         </div>
      </div>).props.children;
   }
}

export default withTranslation(TemplatePage, 'EditathonConfig.TemplatePage');
