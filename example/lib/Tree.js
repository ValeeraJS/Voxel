(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.Tree = {}));
}(this, (function (exports) { 'use strict';

	const FIND_LEAVES_VISITOR = {
	    enter: (node, result) => {
	        if (!node.children.length) {
	            result.push(node);
	        }
	    }
	};
	const ARRAY_VISITOR = {
	    enter: (node, result) => {
	        result.push(node);
	    }
	};
	class AbstractTreeNode {
	    constructor() {
	        this.parent = null;
	        this.children = [];
	    }
	    addNode(node) {
	        if (this.hasAncestor(node)) {
	            throw new Error("The node added is one of the ancestors of current one.");
	        }
	        this.children.push(node);
	        node.parent = this;
	        return this;
	    }
	    depth(node = this) {
	        if (!node.children.length) {
	            return 1;
	        }
	        else {
	            const childrenDepth = [];
	            for (const item of node.children) {
	                item && childrenDepth.push(this.depth(item));
	            }
	            let max = 0;
	            for (const item of childrenDepth) {
	                max = Math.max(max, item);
	            }
	            return 1 + max;
	        }
	    }
	    findLeaves() {
	        const result = [];
	        this.traverse(FIND_LEAVES_VISITOR, result);
	        return result;
	    }
	    findRoot(node = this) {
	        if (node.parent) {
	            return this.findRoot(node.parent);
	        }
	        return node;
	    }
	    hasAncestor(node) {
	        if (!this.parent) {
	            return false;
	        }
	        else {
	            if (this.parent === node) {
	                return true;
	            }
	            else {
	                return this.parent.hasAncestor(node);
	            }
	        }
	    }
	    removeNode(node) {
	        if (this.children.includes(node)) {
	            this.children.splice(this.children.indexOf(node), 1);
	            node.parent = null;
	        }
	        return this;
	    }
	    traverse(visitor, rest) {
	        visitor.enter && visitor.enter(this, rest);
	        visitor.visit && visitor.visit(this, rest);
	        for (const item of this.children) {
	            item && item.traverse(visitor, rest);
	        }
	        visitor.leave && visitor.leave(this, rest);
	        return this;
	    }
	    toArray() {
	        const result = [];
	        this.traverse(ARRAY_VISITOR, result);
	        return result;
	    }
	}

	class TreeNode extends AbstractTreeNode {
	    constructor(data) {
	        super();
	        this.parent = null;
	        this.data = null;
	        this.children = [];
	        this.data = data;
	    }
	}

	let tmpNode;
	class AbstractBinaryTreeNode extends TreeNode {
	    constructor() {
	        super(...arguments);
	        this.children = [null, null];
	        this.parent = null;
	    }
	    addNode(node) {
	        if (this.compare(node)) {
	            if (this.children[1]) {
	                this.children[1].addNode(node);
	            }
	            else {
	                if (this.hasAncestor(node)) {
	                    throw new Error("The node added is one of the ancestors of current one.");
	                }
	                this.children[1] = node;
	                node.parent = this;
	            }
	        }
	        else {
	            if (this.children[0]) {
	                this.children[0].addNode(node);
	            }
	            else {
	                if (this.hasAncestor(node)) {
	                    throw new Error("The node added is one of the ancestors of current one.");
	                }
	                this.children[0] = node;
	                node.parent = this;
	            }
	        }
	        return this;
	    }
	    get left() {
	        return this.children[0];
	    }
	    set left(node) {
	        tmpNode = this.children[0];
	        if (tmpNode) {
	            this.removeNode(tmpNode);
	        }
	        this.children[0] = node;
	        if (node) {
	            node.parent = this;
	        }
	    }
	    removeNode(node) {
	        if (this.children.includes(node)) {
	            this.children[this.children.indexOf(node)] = null;
	            node.parent = null;
	        }
	        return this;
	    }
	    get right() {
	        return this.children[1];
	    }
	    set right(node) {
	        tmpNode = this.children[1];
	        if (tmpNode) {
	            this.removeNode(tmpNode);
	        }
	        this.children[1] = node;
	        if (node) {
	            node.parent = this;
	        }
	    }
	    traverseInOrder(visitor, rest) {
	        tmpNode = this.children[0];
	        visitor.enter && visitor.enter(this, rest);
	        if (tmpNode) {
	            tmpNode.traverseInOrder(visitor, rest);
	        }
	        visitor.visit && visitor.visit(this, rest);
	        tmpNode = this.children[1];
	        if (tmpNode) {
	            tmpNode.traverseInOrder(visitor, rest);
	        }
	        visitor.leave && visitor.leave(this, rest);
	        return this;
	    }
	    traversePostOrder(visitor, rest) {
	        tmpNode = this.children[0];
	        visitor.enter && visitor.enter(this, rest);
	        if (tmpNode) {
	            tmpNode.traversePostOrder(visitor, rest);
	        }
	        tmpNode = this.children[1];
	        if (tmpNode) {
	            tmpNode.traversePostOrder(visitor, rest);
	        }
	        visitor.visit && visitor.visit(this, rest);
	        visitor.leave && visitor.leave(this, rest);
	        return this;
	    }
	    traversePreOrder(visitor, rest) {
	        tmpNode = this.children[0];
	        visitor.enter && visitor.enter(this, rest);
	        visitor.visit && visitor.visit(this, rest);
	        if (tmpNode) {
	            tmpNode.traversePreOrder(visitor, rest);
	        }
	        tmpNode = this.children[1];
	        if (tmpNode) {
	            tmpNode.traversePreOrder(visitor, rest);
	        }
	        visitor.leave && visitor.leave(this, rest);
	        return this;
	    }
	}

	exports.AbstractBinaryTreeNode = AbstractBinaryTreeNode;
	exports.AbstractTreeNode = AbstractTreeNode;
	exports.TreeNode = TreeNode;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
