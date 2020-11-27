'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const notAllowed = /[^\w\d]/g;
const clean = (s) => {
  console.log(s);
  return s.replace(notAllowed, '');
};

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the superior ${chalk.red('generator-f-2-r')} generator!`)
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'includeCode',
        message: 'Would you like to include a code file?',
        default: true
      },
      {
        type: 'input',
        name: 'fullName',
        message: 'Name of the example?',
        default: 'NewExample'
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      const cleanName = clean(props.fullName); // Eventually clean this
      this.props = {
        ...props,
        cleanName,
      };
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(`${this.props.cleanName}/index.js`), 
      this.props,
    );
    
    this.fs.copyTpl(
      this.templatePath('Template.md'),
      this.destinationPath(`${this.props.cleanName}/${this.props.cleanName}.md`), 
      this.props,
    );
    
    if (this.props.includeCode) {
      this.fs.copyTpl(
        this.templatePath('Template.jsexample'),
        this.destinationPath(`${this.props.cleanName}/${this.props.cleanName}.jsexample`), 
        this.props,
      );
    }
  }

  install() {
    // this.installDependencies();
  }
};
