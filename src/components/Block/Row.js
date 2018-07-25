import React from 'react'
import { View, Text } from 'react-native'

import Block from './Block'
import BlockManager from './Manager'
import VoidBlock from './Void'

import styles from '../../styles'

export default class RowBlock extends React.Component {
    voidBlock (visible, index) {
        return (
            <VoidBlock key={ index }
                style={ styles.block['2-2'] }
                editMode={ this.props.editMode || visible }
                onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
            />
        )
    }

    block (config, index) {
        const blockManagerStyle = [
            styles.block['2-2'],
            {
        		justifyContent: 'space-between',
        		alignContent: 'space-between',
            },
            this.props.style,
        ]

        const rowStyle = {
            justifyContent: 'space-between',
            alignContent: 'space-between',
            paddingHorizontal: 0,
            paddingBottom: 0,
        }

        if (Array.isArray(config)) {
            return (
                <BlockManager key={ index }
                    style={ blockManagerStyle }
                    rowStyle={ rowStyle }
                    blocks={ config }
                    editMode={ this.props.editMode }
                    onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                    plainEmpty={ true }
                />
            )
        }
        else {
            var style = [
                config.style,
                styles.block[(config.extend ? '1' : '2') + '-2']
            ]

            if (config.text || config.image || config.children) {
                return (
                    <Block key={ index }
                        onPress={ config.onPress }
                        style={ style }
                        editStyle={ config.editStyle }
                        editMode={ this.props.editMode }
                        onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                        text={ config.text }
                        image={ config.image }
                        extend={ config.extend }
                    >
                        { config.children }
                    </Block>
                )
            }
            else
                return this.voidBlock(false, index)
        }
    }

    blocks (config) {
        var blocks = config.map((block, index) => this.block(block, index));

        if (config.length === 0)
            blocks.push(this.voidBlock(true, 0))

        if (config.length === 1 && !config[0].extend)
            blocks.push(this.voidBlock(false, 1))

        return blocks
    }

    render() {
		return (
            <View style={[ styles.block.row, this.props.style ]}>
                { this.blocks(this.props.blocks) }
            </View>
		)
	}
}
