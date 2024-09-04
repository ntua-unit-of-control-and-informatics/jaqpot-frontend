'use client';

import React from 'react';
import { Code } from '@nextui-org/react';
import { Snippet } from '@nextui-org/snippet';
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/button';
import { Tab, Tabs } from '@nextui-org/tabs';

export default function Page() {
  return (
    <Tabs aria-label="Options">
      <Tab key="jaqpotpy" title="Python SDK">
        <div className="flex flex-col items-start gap-5 p-4">
          <h1 className="mb-5 text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
            Create new model
          </h1>
          <p>
            Follow these instructions to set up and use the{' '}
            <Code>jaqpotpy</Code> library to create and upload a new model.
          </p>

          <h2>1. Install Jaqpotpy</h2>
          <Snippet
            color="primary"
            classNames={{
              copyButton: 'size-3',
            }}
          >
            pip install jaqpotpy
          </Snippet>

          <h2>2. Create and Upload a Model</h2>
          <p>
            Use the following code to create and upload a model using the{' '}
            <Code>jaqpotpy</Code> library:
          </p>
          <pre className="rounded-md bg-gray-100 p-5 text-sm leading-tight">
            {`
from jaqpotpy import Jaqpot
import pandas as pd
from sklearn.linear_model import LinearRegression

# Initialize Jaqpot
jaqpot = Jaqpot()

# Load your data
df = pd.read_csv('/path/to/gdp.csv')

# Train your model
lm = LinearRegression()
y = df['GDP']
X = df[['LFG', 'EQP', 'NEQ', 'GAP']]
model = lm.fit(X=X, y=y)

# Deploy the model on Jaqpot
jaqpot.deploy_sklearn(model, X, y, title="GDP Model", description="Predicting GDP based on various factors")
        `}
          </pre>

          <h2>3. Try it in a Jupyter Notebook</h2>
          <p>
            For a hands-on experience, you can try the above code in an online
            Jupyter Notebook or Google Colab:
          </p>
          <Button
            color="primary"
            endContent={<ArrowTopRightOnSquareIcon className="size-5" />}
            onPress={() => {
              open('https://colab.research.google.com/', '_blank');
            }}
          >
            Open in Google Colab
          </Button>
        </div>
      </Tab>
      <Tab key="jaqpotr" title="R SDK" isDisabled>
        TODO
      </Tab>
    </Tabs>
  );
}
