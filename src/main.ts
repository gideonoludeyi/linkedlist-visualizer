import P5 from 'p5';

type Optional<T> = T | null;

const arrow = (p5: P5, start: P5.Vector, dir: P5.Vector, width = 4) => {
    const end = P5.Vector.add(start, dir);
    p5.push();
    p5.stroke('white');
    p5.strokeWeight(width);
    p5.line(start.x, start.y, end.x, end.y);
    p5.pop();

    /** Draws an arrow
     * Solution from {@link https://stackoverflow.com/a/44892083}
     */
    const angle = p5.atan2(start.y - end.y, start.x - end.x); // angle of the line
    const offset = width * 3;
    p5.push(); // start new drawing state
    p5.translate(end.x, end.y); // translates to the destination vertex
    p5.rotate(angle - p5.HALF_PI); // rotates the arrow point
    p5.triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); // draws the arrow point as a triangle
    p5.pop();
};

class Node<T> {
    constructor(private item: T, private next: Optional<Node<T>>) {}

    getItem(): T {
        return this.item;
    }

    getNext(): Optional<Node<T>> {
        return this.next;
    }

    setNext(node: Optional<Node<T>>) {
        this.next = node;
    }

    draw(p5: P5, x: number, y: number) {
        const w = 75;
        const h = 50;
        const l = x;
        const t = y;
        const r = l + w;
        const b = t + h;
        const vc = (t + b) / 2; // vertical center

        p5.rect(l, t, w, h);
        p5.text(`${this.item}`, l + 25, vc);
        if (this.next) {
            arrow(p5, p5.createVector(r, vc), p5.createVector(25, 0));
            this.next.draw(p5, r + 25, y);
        }
    }
}

class LinkedList<T> {
    private head: Optional<Node<T>> = null;

    add(index: number, item: T) {
        if (this.head == null) {
            this.head = new Node(item, this.head);
        } else if (index == 0) {
            this.head = new Node(item, this.head);
        } else {
            let p: Optional<Node<T>> = this.head;
            let i = 0;
            while (p && i < index - 1) {
                p = p.getNext();
                i += 1;
            }
            if (p) {
                p.setNext(new Node(item, p.getNext()));
            }
        }
    }

    remove(idx: number) {
        if (!this.head) return;
        let p: Optional<Node<T>> = this.head;
        let q: Optional<Node<T>> = null;
        let i = 0;
        while (p && i < idx) {
            q = p;
            p = p.getNext();
            i += 1;
        }
        if (q == null) {
            // idx == 0
            this.head = this.head.getNext();
        } else if (p != undefined) {
            q.setNext(p.getNext());
        }
    }

    draw(p5: P5) {
        if (this.head) {
            this.head.draw(p5, 10, 10);
        }
    }
}

function sketch(p5: P5) {
    let list = new LinkedList<number>();

    function setup() {
        const canvas = p5.createCanvas(800, 600);
        canvas.parent('app');

        list.add(0, 5);
        list.add(0, 4);
        list.add(0, 3);
        list.add(0, 2);
        list.add(0, 1);

        const addArg = p5
            .createInput('insertionArgument', 'number')
            .attribute('placeholder', 'Value to insert...');
        const addInput = p5
            .createInput('insertionKey', 'number')
            .attribute('placeholder', 'Index to insert at...');
        const addBtn = p5.createButton('Insert').mousePressed(() => {
            const value = Number(addArg.value());
            const index = Number(addInput.value() || 0);
            list.add(index, value);
        });

        p5.createDiv().child(addArg).child(addInput).child(addBtn);

        const removeInput = p5
            .createInput('deletionKey', 'number')
            .attribute('placeholder', 'Index to delete from...');
        const removeBtn = p5
            .createButton('Remove')
            .mousePressed(() => list.remove(Number(removeInput.value())));
        p5.createDiv().child(removeInput).child(removeBtn);
    }

    function draw() {
        p5.background('black');
        list.draw(p5);
    }

    p5.setup = setup;
    p5.draw = draw;
}

new P5(sketch); // run the program
